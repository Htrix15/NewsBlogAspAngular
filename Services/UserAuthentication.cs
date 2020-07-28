using System;
using System.Threading.Tasks;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using System.Text;
using AspAngularBlog.Models;
using AspAngularBlog.ServicesModels;

namespace AspAngularBlog.Services
{
    public class UserAuthentication
    {
        private readonly DbOperations _dbOperations;
        public UserAuthentication(DbOperations dbOperations)
        {
            _dbOperations = dbOperations;
        }
        public string GetHashString(string password)
        {
            MD5 md5Hash = MD5.Create();
            byte[] salt = md5Hash.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(password, salt, KeyDerivationPrf.HMACSHA1, 1000, 256 / 8));
        }

        public async Task<DataShell> AuthenticationAsync(IValidator user)
        {
            var result = new DataShell();
            var hashPassword = await _dbOperations.GetUserHashPasswordAsync(((User)user).Login);

            if (hashPassword.stringData == null) {
                result.error = "User not found";
                return result;
            }
            if (hashPassword.error!=null){
                result.error = hashPassword.error;
                return result;
            }
            if(GetHashString(((User)user).Password) != hashPassword.stringData){
                result.error = "Password incorrect";
                return result;
            }
        
            return result;
        }


        public async Task<DataShell> ChangeLoginAsync(IValidator logins)
        {
            return await _dbOperations.ChangeLoginAsync(((ChangeUser)logins));
        }
        public async Task<DataShell> ChangePasswordAsync(IValidator passwords)
        {
            ((ChangeUser)passwords).oldValue = GetHashString(((ChangeUser)passwords).oldValue);
            ((ChangeUser)passwords).newValue = GetHashString(((ChangeUser)passwords).newValue);
            return await _dbOperations.ChangePasswordAsync((ChangeUser)passwords);
        }

    }
}
